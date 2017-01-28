import React, { Component } from 'react';
import './App.css';

const data = [
  {
    recipe_name: "Peanut Butter and Jelly Sandwich",
    ingredients: [
      "Bread (usually one or two slices per sandwich)",
      "Peanut Butter",
      "Jelly or Jam",
    ],
    instructions: [
      "Spread peanut butter evenly onto one slice of bread using a knife.",
      "Spread jelly or jam evenly onto the other slice of bread.",
      "Press the two slices of bread together.",
      "Cut the sandwich",
      "Enjoy your easy and yummy looking sandwich!"
    ],
  }
];


class RecipeForm extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      ingredients: 1,
      instructions: 1,
    };
  }

  addElement = (event) => {
    let element = event.target.name;

    if(element === "instruction"){
      this.setState({
        instructions: this.state.instructions + 1,
      });
    }
    else{
      this.setState({
        ingredients: this.state.ingredients + 1,
      });
    }
  }

  deleteElement = (event) => {
    let element = event.target.name;

    if(element === "instruction"){
      if(this.state.instructions >= 1){
        this.setState({
          instructions: this.state.instructions - 1,
        })
      }
    }
    else{
      if(this.state.ingredients >= 1){
        this.setState({
          ingredients: this.state.ingredients - 1,
        })
      }
    }
  }

  render(){
    let ingredients = [];
    let instructions = [];
    for (let indexNumber = 0; indexNumber < this.state.ingredients; indexNumber++) {
      ingredients.push(
        <input 
          type="text" 
          className="form-control" 
          name={"ingredient_" + indexNumber+1}
          key={"ingredient_" + indexNumber+1} 
          placeholder="Ingredient Name" />
      )
    }

    for (let indexNumber = 0; indexNumber < this.state.instructions; indexNumber++) {
      instructions.push(
        <input 
          type="text" 
          className="form-control" 
          name={"instruction_" + indexNumber+1}
          key={"instruction_" + indexNumber+1} 
          placeholder="Instruction" />
      )
    }
    return (
      <div className="RecipeForm">
        <form>
          <input 
            type="text" 
            className="form-control" 
            name="recipeName" 
            placeholder="Recipe Name" />
          <hr/>
          {ingredients}
          <a 
            className="add btn btn-primary"
            onClick={this.addElement}
            name="ingredient"
          >
            Add
          </a>
          <a 
            className="add btn btn-primary"
            onClick={this.deleteElement}
            name="ingredient"
          >
            Delete
          </a>
          <hr/>
          {instructions}
          <a 
            className="add btn btn-primary"
            onClick={this.addElement}
            name="instruction">
            Add
          </a>
          <a 
            className="add btn btn-primary"
            onClick={this.deleteElement}
            name="instruction"
          >
            Delete
          </a>
          <hr/>
          <button type="submit" className="btn btn-success">Submit</button>
        </form>
      </div>
    );
  }
}

const RecipesList = (props) => {
  return (
    <div className="RecipesWrapper">
      {
        props.data.map((el, index) => {
          return(
            <div key={"recipe" + index} className="RecipeBox">
              <a href="#" 
                className="recipe_title"
                onClick={props.recipeStatus}>
                {el.recipe_name}
              </a>
              <div className={"recipe_details " + (props.recipeOpen ? "collapse in" : "collapse")}>
                <h3>Ingredients</h3>
                <ol>
                  {
                    el.ingredients.map((el, index) => {
                      return (
                        <li key={"ingredient" + index}>
                          {el}
                        </li>
                      )     
                    })
                  }
                </ol>
                <h3>Instructions</h3>
                <ol>
                  {
                    el.instructions.map((el, index) => {
                      return (
                        <li key={"instruction" + index}>
                          {el}
                        </li>
                      )     
                    })
                  }
                </ol>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      new_recipe: false,
      data: data,
      recipeOpen: false,
    };
  }

  componentDidMount(){
    let dataLocal = JSON.parse(localStorage.getItem('recipe-data')) || [];
    this.setState({
      data: Object.assign([], data, dataLocal),
    });
  }

  recipeStatus = (event) => {
    let recipeOpen = this.state.recipeOpen;
    if(recipeOpen){
      recipeOpen = false;
    }
    else{
      recipeOpen = true;
    }
    this.setState({
      recipeOpen,
    })
  }

  addRecipe = (event) => {
    this.setState({
      new_recipe: true,
    })
  }

  render() {
    return (
      <div className="App container">
        <h3 className="bg-primary title">Recipe Box</h3>
        <button 
          className="btn btn-success"
          onClick={this.addRecipe}
        >
          Add Recipe
        </button>
        {
          this.state.new_recipe
          ? (
            <RecipeForm />
          )
          : (
            <RecipesList 
              data={this.state.data}
              recipeStatus={this.recipeStatus}
              recipeOpen={this.state.recipeOpen}/>
          )
        }
      </div>
    );
  }
}

export default App;