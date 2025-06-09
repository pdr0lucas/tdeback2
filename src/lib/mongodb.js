import { MongoClient } from 'mongodb'

// A URI está diretamente no código, ignorando o .env.local
const uri = "mongodb+srv://mongodbatlas:zY4WvAi1jORc0gbw@cluster0.p8rzymp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// A verificação que causava o erro foi REMOVIDA.

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise