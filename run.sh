cd bank-pro
npm install
pm2 delete --silent bank_pro || ':'
pm2 npm start --name bank_pro
pm2 status