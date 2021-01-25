echo '\n\nrequesting all heroes'
curl localhost:3000/heroes

echo '\n\nrequest flash'
curl localhost:3000/heroes/1

echo '\n\nrequesting with wrong body'
curl --silent -X POST \
    --data-binary '{"invalid": "data"}' \
    localhost:3000/heroes

echo '\n\n creating batman'
CREATE=$(curl --silent -X POST \
    --data-binary '{"name": "Batman", "age": 32, "power": "Money"}' \
    localhost:3000/heroes)

echo $CREATE

ID=$(echo $CREATE | jq .id)
echo $ID

echo '\n\nrequest batman'
curl localhost:3000/heroes/$ID
