chmod 400 $pem_key
ssh -o "StrictHostKeyChecking=no" -i $pem_key $machine@$IP "rm -rf bank-pro && mkdir bank-pro"
scp -r -o "StrictHostKeyChecking=no" -i $pem_key * $machine@$IP:~/bank-pro
ssh -o "StrictHostKeyChecking=no" -i $pem_key $machine@$IP "bash" < ./run.sh
