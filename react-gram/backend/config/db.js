const mongoose = require('mongoose');
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

//conexão
const connec = async () => {
  try {
    const dbConnect = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tmo8ggp.mongodb.net/?appName=Cluster0`,
    );

    console.log('conectou ao banco');
    return dbConnect;
  } catch (error) {
    console.log(error);
  }
};

connec();

module.exports = connec;
