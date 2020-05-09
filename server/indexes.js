import { ChatsCollection, MessagesCollection } from "../modules/chats/collections";
import { TransportsCollection } from "../modules/transports/collections";
import { DistributionAlgorithms } from "../modules/distribution/collections";

const dbIndexesConf = [
  {
    collection: ChatsCollection,
    indexes: [
      {
        name: 1
      },
      {
        channel: 1,
        channelChatId: 1
      }
    ]
  },
  {
    collection: MessagesCollection,
    indexes: [
      {
        chatId: 1,
        createdAt: 1
      }
    ]
  },
  {
    collection: TransportsCollection,
    indexes: [
      {
        name: 1
      }
    ]
  },
  {
    collection: DistributionAlgorithms,
    indexes: [
      {
        name: 1
      }
    ]
  }
];

dbIndexesConf.forEach(({ collection, indexes }) => {
  const rawCollection = collection.rawCollection();

  indexes.forEach(dbIndex => {
    rawCollection.createIndex(dbIndex).then(
      res => {
        console.log("Created index", collection._name, dbIndex);
      },
      () => {
        console.warn("Unable to create index for", collection._name, dbIndex);
      }
    );
  });
});
