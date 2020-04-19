import { DistributorInterface } from "./distributor";
import { RoundRobinAlgorithm } from "./algorithms/roundRobin";

import { DistributionAlgorithms } from "./../collections";

const distributorInterface = new DistributorInterface();

const algorithms = [new RoundRobinAlgorithm()];

algorithms.forEach(algorithmImpl => {
  if (!DistributionAlgorithms.findOne({ name: algorithmImpl.getName() }, { fields: { _id: 1 } })) {
    DistributionAlgorithms.insert(algorithmImpl.getDocInitialFields());
  }
  distributorInterface.register(algorithmImpl);
});

export { distributorInterface };
