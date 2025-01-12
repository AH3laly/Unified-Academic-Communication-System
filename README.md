# Unified Academic Communication System (UACS)
Web application works as a centralized communication system between all universities, it could be also useful in other fields.

Two types of accounts:
- Institution Accounts: Have the parentId = '', they can create sub accounts.
- Normal Accounts: Have parentId non-empty, and the value of parentId refers to the parentId of an Institution account.

Users could send messages to eachother.
Users could search for other users.
Users could create Posts to be visible for all users.
User can search for Posts created by other users.

# Run Back-end
node app

# Run Front-end
npm run dev

# Install Mongodb container
sudo docker run -itd --name mongodb-uacs mongodb/mongodb-community-server

# Access Mongodb container
sudo docker exec -it mongodb-uacs bash
mongosh

# Access system
Back-end: http://localhost:3000/
Front-end: http://localhost:5173/

# Create Demo Data
http://localhost:3000/demo/create

# Demo users for testing
User: admin@utm.edu.my Password: password
User: admin@mmu.edu.my Password: password
User: admin@unisza.edu.my Password: password
User: admin@upm.edu.my Password: password


# Mongodb Commands:
Show Non Institution Accounts:
db.account.find({parentId: {$not: {$eq: ''}}})
db.account.find({parentId: ''}) // Show institution account

Demo Video:


