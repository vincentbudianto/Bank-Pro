cd bank-pro
npm install
pm2 delete --silent bank_pro || ':'
pm2 start start.sh --name bank_pro
pm2 status