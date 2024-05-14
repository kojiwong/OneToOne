
# CSC309 P3

## Initialization
Run the following lines to initialize
```
cd app/frontend
npm install --force
npm start

cd ../backend
python3 -m venv venv
pip install -r requirements.txt
source venv/bin/activate
chmod u+x run.sh
chmod u+x manage.py
./run.sh
```

## Testing
There are three accounts with the usernames: owner1, invitee1, invitee2
All have the password: 12345678

owner1 has all the prepopulated calendars and invitee1 and invitee2 have responded to some.


## Urls 
register
http://localhost:3000/register

login
http://localhost:3000/login

manage all calendars
http://localhost:3000/calendars

manage invitations
http://localhost:3000/invitations

manage contacts
http://localhost:3000/contacts

profile
http://localhost:3000/profile


Note: if you get 401 error you may have to manually go to the login url again


