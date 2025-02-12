import flask_admin.contrib
import flask_admin.contrib.sqla
import flask, json, datetime, flask_admin, flask_sqlalchemy
from flask_admin.contrib.sqla import ModelView
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
from flask_security.models import sqla
from flask_security import Security, current_user, hash_password, SQLAlchemySessionUserDatastore 
import bitrix24, os, secrets

config_json = json.loads(open("config.json", "r", encoding="utf-8").read())
bitrix_url = config_json["bx24url"]
bx24 = bitrix24.Bitrix24(bitrix_url)

app = flask.Flask("HelpResource")
app.config["SECURITY_POST_LOGOUT_VIEW"] = "/admin"
app.config["SECURITY_POST_LOGIN_VIEW"] = "/admin"
# Generate a nice key using secrets.token_urlsafe()
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
# Generate a good salt for password hashing using: secrets.SystemRandom().getrandbits(128)
app.config['SECURITY_PASSWORD_SALT'] = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')
app.config["SECURITY_EMAIL_VALIDATOR_ARGS"] = {"check_deliverability": False}

engine = create_engine('sqlite:///database.db')
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
app.teardown_appcontext(lambda exc: db_session.close())
Base = declarative_base()
sqla.FsModels.set_db_info(base_model=Base)

class Questions(Base):
    __tablename__ = "questions"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    question = sqlalchemy.Column(sqlalchemy.String(1000))
    answer = sqlalchemy.Column(sqlalchemy.Text(100000))

class Contacts(Base):
    __tablename__ = "contacts"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    contact_id = sqlalchemy.Column(sqlalchemy.Integer)
    name = sqlalchemy.Column(sqlalchemy.String(100))
    phone = sqlalchemy.Column(sqlalchemy.String(100))

class Role(Base, sqla.FsRoleMixin):
    __tablename__ = 'role'

class User(Base, sqla.FsUserMixin):
    __tablename__ = 'user'

# db_session.query(User).delete()
# db_session.crea

def init_db():
    Base.metadata.create_all(bind=engine)

init_db()
# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
security = Security(app, user_datastore)

class MyModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated
    
    def _handle_view(self, name, **kwargs):
       if not self.is_accessible():
           return app.redirect("/login")

class MyAdminIndexView(flask_admin.AdminIndexView):
    def is_accessible(self):
        return current_user.is_authenticated
    
    def _handle_view(self, name, **kwargs):
       if not self.is_accessible():
           return app.redirect("/login")

admin = flask_admin.Admin(app, index_view=MyAdminIndexView())
admin.add_view(MyModelView(Questions, db_session))

session_data = []
session_ips = {}

@app.before_request
def make_session_permanent():
    flask.session.permanent = True
    app.permanent_session_lifetime = datetime.timedelta(minutes=10)

@security.context_processor
def security_context_processor():
    return dict(
        admin_base_template = admin.base_template,
        admin_view = admin.index_view,
        h = flask_admin.helpers,
        get_url = flask.url_for
    )

@app.route("/")
def index():
    return flask.render_template("index.html", config_json=config_json)

@app.route("/get_tt")
def send_token():
    responce = app.response_class(response=f'{{"table": \"{json.loads(open("config.json", "r").read())["table_token"]}\"}}', status=200, mimetype="application/json")
    responce.headers['Access-Control-Allow-Origin'] = '*'
    return responce

@app.route("/get_faq")
def send_faq():
    faq = db_session.query(Questions).all()
    faq_json = []
    for question in faq:
        faq_json.append({"question": str(question.question), "answer": str(question.answer)})
    response = app.response_class(response=json.dumps(faq_json, ensure_ascii=False), status=200, mimetype="application/json")
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route("/send", methods = ['POST'])
def get_data():
    responce = app.response_class()
    request_json = flask.request.json
    request_json["timestamp"] = datetime.datetime.now().timestamp() // (30 * 60)
    request_json["ip"] = flask.request.remote_addr
    print(request_json)
    if flask.request.remote_addr not in session_ips:
        session_ips[flask.request.remote_addr] = 0
    if datetime.datetime.now().timestamp() - session_ips[flask.request.remote_addr] > 30:
        if request_json not in session_data:
            responce.status = 200
            session_data.append(request_json)
            session_ips[flask.request.remote_addr] = datetime.datetime.now().timestamp()
            send_to_bitrix(request_json)
        else:
            responce.status = 208
    else:
        if request_json not in session_data:
            responce.status = 230
        else:
            responce.status = 208
    return responce

def contact_exist():
    print(bx24.callMethod("crm.contact.list", {
		"order": { "DATE_CREATE": "ASC" },
		"filter": { "TYPE_ID": "CLIENT" },
		"select": [ "ID", "NAME", "LAST_NAME", "TYPE_ID", "SOURCE_ID" ]
	}))

def bitrix_add_contact(utm_json, name: str, phone: str, username: str="", id=""):
    contact_data = {
        'fields': {
            "NAME": name,
            "UF_CRM_TG_USERNAME": username,
            "UF_CRM_TG_ID": id,
			"OPENED": "Y", 
			"ASSIGNED_BY_ID": 1, 
			"TYPE_ID": "CLIENT",
			"SOURCE_ID": "SELF",
			"PHONE": [ { "VALUE": phone} ]
        },
        'params': { "REGISTER_SONET_EVENT": "Y" }	
    }
    try:
        contact_data["fields"]["UTM_SOURCE"] = utm_json["utm_source"]
    except:
        pass
    try:
        contact_data["fields"]["UTM_MEDIUM"] = utm_json["utm_medium"]
    except:
        pass
    try:
        contact_data["fields"]["UTM_CAMPAIGN"] = utm_json["utm_campaign"]
    except:
        pass
    try:
        contact_data["fields"]["UTM_CONTENT"] = utm_json["utm_content"]
    except:
        pass
    try:
        contact_data["fields"]["UTM_TERM"] = utm_json["utm_term"]
    except:
        pass
    return bx24.callMethod("crm.contact.add", contact_data)

def bitrix_get_item_id(field_id: str, item: str):
    fields = bx24.callMethod("crm.deal.fields")
    for i in fields[field_id]["items"]:
        if i["VALUE"] == item:
            return int(i["ID"])
    print(field_id, item, "not found!")

def bitrix_add_comment(entity_id, comment: str):
    comment_data = {
        "fields": {
            "ENTITY_ID": entity_id,
            "ENTITY_TYPE": "deal",
            "COMMENT": comment
        }
    }
    return bx24.callMethod("crm.timeline.comment.add", comment_data)

def bitrix_add_deal(contact_id, data_json, utm_json):
    deal_data = {
        "fields": {
            "TITLE": "HR Telegram",
            "STAGE_ID": "NEW",
            "CONTACT_ID": contact_id,
            "OPENED": "Y",
            "SOURCE_ID": "UC_CLG7I0",
            "CATEGORY_ID": 2,
            "UF_CRM_CLIENT_CITY": data_json["data"]["client_city"], 
            "UF_CRM_COMMUNICATION": data_json["data"]["communication"],
            "UF_CRM_1689853611855": bitrix_get_item_id("UF_CRM_1689853611855", data_json["data"]["vacancy"]["Проект"]),
            "UF_CRM_1697100290326": data_json["data"]["vacancy"]["Должность"],
            "UF_CRM_VACANCY_CITY": data_json["data"]["vacancy"]["Город"],
            "UF_CRM_HOUSING": data_json["data"]["vacancy"]["Наличие проживания"],
            "UF_CRM_NUTRITION": data_json["data"]["vacancy"]["Наличие питания"],
            "UF_CRM_PAY_RATE": data_json["data"]["vacancy"]["Частота выплат"],
            "UF_CRM_PAYMENT": data_json["data"]["vacancy"]["Оплата за смену"],
            "UF_CRM_PAPERWORK": data_json["data"]["vacancy"]["Вид оформления"],
            "BEGINDATE": datetime.datetime.now().strftime("%d.%m.%Y, %H:%M:%S")
        },
        "params": { "REGISTER_SONET_EVENT": "Y" }
    }
    try:
        deal_data["fields"]["UF_CRM_VACANCY_DESCRIPTION"] = data_json["data"]["vacancy"]["Описание вакансии"]
    except:
        pass
    try:
        deal_data["fields"]["UF_CRM_BONUSES"] = data_json["data"]["vacancy"]["Бонусы"]
    except:
        pass
    try:
        deal_data["fields"]["UTM_SOURCE"] = utm_json["utm_source"]
    except:
        pass
    try:
        deal_data["fields"]["UTM_MEDIUM"] = utm_json["utm_medium"]
    except:
        pass
    try:
        deal_data["fields"]["UTM_CAMPAIGN"] = utm_json["utm_campaign"]
    except:
        pass
    try:
        deal_data["fields"]["UTM_CONTENT"] = utm_json["utm_content"]
    except:
        pass
    try:
        deal_data["fields"]["UTM_TERM"] = utm_json["utm_term"]
    except:
        pass
    return bx24.callMethod("crm.deal.add", deal_data)

def send_to_bitrix(data_json):
    name = data_json["data"]["name"]
    phone = data_json["data"]["phone"]
    phone = phone.strip()
    name = name.strip()
    contact_id = ""
    utm_json = {}
    try:
        for i in data_json["user_info"]["start_param"].split("__"):
            utm_json[i.split("=")[0].lower()] = i.split("=")[1]
    except:
        pass
    print(utm_json)
    contacts = db_session.scalars(sqlalchemy.select(Contacts).where(sqlalchemy.and_(Contacts.name == name.lower(), Contacts.phone == phone))).all()
    telegram_id = ""
    username = ""
    if len(contacts) == 0:
        print("Empty")
        try:
            telegram_id = data_json["user_info"]["user"]["id"]
        except:
            pass
        try:
            username = data_json["user_info"]["user"]["username"]
        except:
            pass
        contact_id = bitrix_add_contact(utm_json, name, phone, username, telegram_id)
        db_session.add(Contacts(name=name.lower(), contact_id=contact_id, phone=phone))
        db_session.commit()
    else:
        contact_id = contacts[0].contact_id
    deal = bitrix_add_deal(contact_id, data_json, utm_json)
    comment = f"Имя: {name}{chr(10)}Номер телефона: {phone}{chr(10)}Город соискателя: {data_json['data']['client_city'].replace(chr(10), '')}{chr(10)}Удобный способ связи: {data_json['data']['communication'].replace(chr(10), '')}{chr(10)}"
    if username != "":
        comment += f"Телеграмм Username: {username}{chr(10)}"
    if telegram_id != "":
        comment += f"Телеграмм ID: {telegram_id}{chr(10)}"
    comment += f"Проект: {data_json['data']['vacancy']['Проект'].replace(chr(10), '')}{chr(10)}Вакансия: {data_json['data']['vacancy']['Должность'].replace(chr(10), '')}{chr(10)}Город вакансии: {data_json['data']['vacancy']['Город'].replace(chr(10), '')}{chr(10)}Наличие проживания: {data_json['data']['vacancy']['Наличие проживания'].replace(chr(10), '')}{chr(10)}Наличие питания: {data_json['data']['vacancy']['Наличие питания'].replace(chr(10), '')}{chr(10)}Частота выплат: {data_json['data']['vacancy']['Частота выплат'].replace(chr(10), '')}{chr(10)}Оплата за смену: {data_json['data']['vacancy']['Оплата за смену'].replace(chr(10), '')}{chr(10)}Вид оформления: {data_json['data']['vacancy']['Вид оформления'].replace(chr(10), '')}{chr(10)}"
    try:
        comment += f"Описание вакансии: {data_json['data']['vacancy']['Описание вакансии'].replace(chr(10), '')}{chr(10)}"
    except:
        pass
    try:
        comment += f"Бонусы: {data_json['data']['vacancy']['Бонусы'].replace(chr(10), '')}{chr(10)}"
    except:
        pass
    comment = comment.replace("\t", "").replace("\n\n", "\n")
    print(repr(comment))
    bitrix_add_comment(deal, comment)

with app.app_context():
    init_db()
    security.datastore.find_or_create_role(
        name="user", permissions={"user-read", "user-write"}
    )
    db_session.commit()
    # print(config_json["email"])
    if not security.datastore.find_user(email=config_json["email"]):
        security.datastore.create_user(email=config_json["email"],
        password=hash_password(config_json["password"]), roles=["user"])
    db_session.commit()

if __name__ == "__main__":
    # User.__table__.drop(engine)
    # db.create_all()
    # Contacts.__table__.drop(engine)
    app.run("0.0.0.0", debug=True, ssl_context=('cert.pem', 'key.pem'), port=443)