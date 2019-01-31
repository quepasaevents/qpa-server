import Repository from "../repository";

class EventsRepository {
  repository: Repository

  constructor({repository}) {
    this.repository = repository
  }

}

export { EventsRepository };
