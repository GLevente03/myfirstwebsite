class Player{
    #name;
    #points;
    #numOfPuddings;
    #numOfMakiRolls;


    constructor(name, points, numOfPuddings, numOfMakiRolls){
        this.#name = name;
        this.#points = points;
        this.#numOfPuddings = numOfPuddings;
        this.#numOfMakiRolls = numOfMakiRolls;
    }

    toJSON(){
        return {
            name: this.#name,
            points: this.#points,
            numOfPuddings: this.#numOfPuddings,
            numOfMakiRolls: this.#numOfMakiRolls
        };
    }

    static fromJSON(data) {
        return new Player(data.name, data.points, data.numOfPuddings, data.numOfMakiRolls);
    }

    // name
    get name() {
        return this.#name;
    }
    set name(value) {
        if (typeof value === "string") this.#name = value;
        else throw new Error("Name must be a string");
    }

    // points
    get points() {
        return this.#points;
    }
    set points(value) {
        if (Number.isInteger(value) && value >= 0) this.#points = value;
        else throw new Error("Points must be a non-negative integer");
    }

    // numOfPuddings
    get numOfPuddings() {
        return this.#numOfPuddings;
    }
    set numOfPuddings(value) {
        if (Number.isInteger(value) && value >= 0) this.#numOfPuddings = value;
        else throw new Error("Number of puddings must be a non-negative integer");
    }

    // numOfMakiRolls
    get numOfMakiRolls() {
        return this.#numOfMakiRolls;
    }
    set numOfMakiRolls(value) {
        if (Number.isInteger(value) && value >= 0) this.#numOfMakiRolls = value;
        else throw new Error("Number of maki rolls must be a non-negative integer");
    }
}
