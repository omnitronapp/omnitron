import { TransportsCollection } from "../collections";
import { Transports } from "../";

function processTransportChange(_id) {
  const transportEntry = TransportsCollection.findOne(_id);

  // were removed from database
  if (!transportEntry) {
    // find which one was removed
    const transportImpls = Transports.getTransports();
    const removedTransport = Object.keys(transportImpls).find(
      transportImpl => !TransportsCollection.findOne({ name: transportImpl })
    );

    if (removedTransport) {
      Transports.stop(removedTransport);
    }
  } else {
    // were updated
    Transports.stop(transportEntry.name);

    if (transportEntry.enabled) {
      Transports.configureTransport(transportEntry.name);
    }
  }
}

export function startTransportsWatcher() {
  TransportsCollection.find().observeChanges({
    changed: processTransportChange,
    removed: processTransportChange
  });
}
