import { DistributionAlgorithms } from "../collections";

export class DistributorInterface {
  constructor() {
    this.algorithmsMap = {};
  }

  register(algorithmImpl) {
    this.algorithmsMap[algorithmImpl.getName()] = algorithmImpl;
  }

  getCurrentAlgorithm() {
    const activeAlgorithm = DistributionAlgorithms.findOne(
      { active: true },
      { fields: { name: 1 } }
    );

    if (activeAlgorithm && this.algorithmsMap[activeAlgorithm.name]) {
      return this.algorithmsMap[activeAlgorithm.name];
    }
  }

  distributeChat(chatId) {
    const algorithm = this.getCurrentAlgorithm();

    if (algorithm) {
      algorithm.distribute(chatId);
    }
  }

  userDataChanged() {
    Object.values(this.algorithmsMap).forEach(algorithmImpl => {
      algorithmImpl.reconfigure();
    });
  }
}
