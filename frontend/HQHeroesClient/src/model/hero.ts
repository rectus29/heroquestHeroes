export class Hero {
  constructor(
    public id: String,
    public name: String,
    public heroClass: String,
    public spiritPoints = 0,
    public healthPoints = 0,
    public attackValue = 0,
    public attackDice = 0,
    public defenceValue = 0,
    public defenceDice = 0,
    public stuff: String[],
    public golds: String[],
    public endedQuests: String[]
  ) {
  }

  static emptyObject() {
    return new Hero(
      "",
      "", "", 0, 0, 0, 0, 0, 0, [], [], []
    );
  }
}
