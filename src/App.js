import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './App.css';

const data = [
  {
    recipe_id: "recipe-1",
    recipe_name: "Peanut Butter and Jelly Sandwich",
    ingredients: [
      "Bread (usually one or two slices per sandwich)",
      "Peanut Butter",
      "Jelly or Jam",
    ],
    instructions: "Spread peanut butter evenly onto one slice of bread using a knife. Spread jelly or jam evenly onto the other slice of bread. Press the two slices of bread together. Cut the sandwich. Enjoy your easy and yummy looking sandwich!",
  }
];


class RecipeForm extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      ingredients: 1,
      recipeData: {},
      fieldError: {},
      recipe_id: '',
    };
  }

  componentDidMount(){
    if(Object.keys(this.props.data).length){
      this.setState({
        recipeData: this.props.data,
        recipe_id: this.props.data.recipe_id,
        ingredients: this.props.data.ingredients.length,
      });
    }
  }

  addElement = (event) => {    
    this.setState({
      ingredients: this.state.ingredients + 1,
    });
  }

  deleteElement = (event) => {
    if(this.state.ingredients > 1){
      this.setState({
        ingredients: this.state.ingredients - 1,
      });
      let ingredientsID = this.state.ingredients;
      let ingredients = this.state.recipeData.ingredients;
      if(typeof ingredients !== 'undefined'){
        ingredients = [...ingredients.slice(0, ingredientsID-1)];
        this.setState({
          recipeData: Object.assign(this.state.recipeData, {ingredients}),
        });
      }
    }
  }

  onChange = (event) => {
    let elementName = event.target.name;
    if(elementName === "recipeName"){
      let recipeName = {recipe_name: event.target.value};
      this.setState({
        recipeData: Object.assign(this.state.recipeData, recipeName),
      });
    }
    else if(elementName === "instructions"){
      let instructions = {instructions: event.target.value};
      this.setState({
        recipeData: Object.assign(this.state.recipeData, instructions),
      });
    }
    else if(elementName.indexOf("ingredient_") !== -1){
      let ingredients = this.state.recipeData.ingredients || [];
      let elementId = elementName.replace('ingredient_', '') - 1;
      ingredients[elementId] = event.target.value;
      let ingredientsObject = {ingredients};
      this.setState({
        recipeData: Object.assign(this.state.recipeData, ingredientsObject),
      });
    }
  }

  formSubmit = (event) => {
    event.preventDefault();
    let totalData = Object.assign({}, this.state.recipeData);
    const fieldError = this.validate(totalData);
    this.setState({fieldError: fieldError});
    if(Object.keys(fieldError).length > 1) return;
    let ingredientErrors = fieldError.ingredients.filter((el, index) => {
      if(el) return el;
    });
    if(ingredientErrors.length) return;
    let totalDataWithID = Object.assign({}, totalData, {recipe_id: this.state.recipe_id});
    this.props.formSubmit(totalDataWithID);
    this.setState({recipeData: {}});
  }

  validate = (data) => {
    const errors = {};
    if(!data.recipe_name || typeof(data.recipe_name) === "undefined") errors.recipe_name = true;
    if(!data.instructions || typeof(data.instructions) === "undefined") errors.instructions = true;
    let ingredientErrors = [];
    for(let ref in this.refs) {
        if(ref.indexOf("ingredient_") !== -1){
          let inputValue = ReactDOM.findDOMNode(this.refs[ref]).value;
          if(inputValue === ""){
            ingredientErrors.push(true);
          }
          else{
            ingredientErrors.push(false);
          }
        }
    }

    errors.ingredients = ingredientErrors;
    
    return errors;
  }

  render(){
    const recipeData = this.state.recipeData;
    let ingredients = [];
    for (let indexNumber = 0; indexNumber < this.state.ingredients; indexNumber++) {
      ingredients.push(
        <input 
          type="text" 
          className={"form-control " + ((typeof this.state.fieldError.ingredients !== "undefined" && this.state.fieldError.ingredients[indexNumber]) ? "has-error" : "")}
          name={"ingredient_" + (indexNumber+1)}
          key={"ingredient_" + (indexNumber+1)} 
          ref={"ingredient_" + (indexNumber+1)} 
          placeholder="Ingredient Name" 
          onChange={this.onChange}
          value={(typeof recipeData.ingredients !== "undefined") ? recipeData.ingredients[indexNumber] : ""} />
      )
    }

    return (
      <div className="RecipeForm">
        <form onSubmit={this.formSubmit}>
          <input 
            type="text" 
            className={"form-control " + (this.state.fieldError.recipe_name ? "has-error" : "")}
            name="recipeName" 
            placeholder="Recipe Name"
            onChange={this.onChange}
            value={(typeof recipeData.recipe_name !== "undefined") ? recipeData.recipe_name : ""} />
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
          <textarea 
          className={"form-control " + (this.state.fieldError.instructions ? "has-error" : "")}
          name="instructions"
          placeholder="Instructions"
          onChange={this.onChange}
          value={(typeof recipeData.instructions !== "undefined") ? recipeData.instructions : ""} />
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
            <div 
              key={"recipe" + el.recipe_id} 
              className="RecipeBox"
              >
              <a href="#" 
                id={el.recipe_id}
                className="recipe_title"
                onClick={props.recipeStatus}>
                {el.recipe_name}
              </a>
              <div className={"recipe_details " + (props.activeElementId === el.recipe_id ? "collapse in" : "collapse")}>
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
                <p>{el.instructions}</p>
                <br/>
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    props.editRecipe(el.recipe_id)
                  }}
                >
                  Edit recipe
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    props.deleteRecipe(el.recipe_id)
                  }}
                >
                  Delete recipe
                </button>
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
      editedData: {},
      activeElementId: '',
      activeButton: 'add',
    };
  }

  componentDidMount(){
    //localStorage.removeItem('recipe-data');
    this.getLocalData();
  }

  getLocalData = () =>{
    let dataLocal = JSON.parse(localStorage.getItem('recipe-data')) || [];
    this.setState({
      data: Object.assign([], data, dataLocal),
    });
  }

  formSubmit = (data) => {
    if(data.recipe_id){
      let editedItemIndex = this.state.data.findIndex(
        (d) => d.recipe_id === data.recipe_id
      );
        let newData = [
        ...this.state.data.slice(0, editedItemIndex),
        data,
        ...this.state.data.slice(editedItemIndex+1, this.state.data.length)
      ];
      this.setState({
        data: newData,
        new_recipe: false,
        activeButton: 'add',
      });
      localStorage.setItem('recipe-data', JSON.stringify(newData));
    }
    else {
      let newId = this.state.data.length + 1;
      let dataWithId = Object.assign({}, data, {recipe_id: "recipe-" + newId});
      this.setState({
        data: this.state.data.concat(dataWithId),
        new_recipe: false,
        activeButton: 'add',
      });
      localStorage.setItem('recipe-data', JSON.stringify(this.state.data.concat(dataWithId)));
    }
  }

  recipeStatus = (event) => {
    this.setState({
      activeElementId: event.target.id,
    })
  }

  addRecipe = (event) => {
    this.setState({
      new_recipe: true,
      activeButton: 'cancel',
      editedData: {},
    })
  }

  cancelRecipe = (event) => {
    this.setState({
      new_recipe: false,
      activeButton: 'add',
      editedData: {},
    });
    this.getLocalData();
  }

  editRecipe = (id) => {
    let editedData = this.state.data.filter((el, index) => {
      if(el.recipe_id === id) return el;
    });
    this.setState({
      new_recipe: true,
      activeButton: 'cancel',
      editedData: editedData[0],
    })
  }

  deleteRecipe = (id) => {
    let deletedItemIndex = this.state.data.findIndex(
      (d) => d.recipe_id === id
    );
    let newData = [
      ...this.state.data.slice(0, deletedItemIndex),
      ...this.state.data.slice(deletedItemIndex+1, this.state.data.length)
    ];
    this.setState({
      data: newData,
    });
    localStorage.setItem('recipe-data', JSON.stringify(newData));
  }

  render() {
    return (
      <div className="App container">
        <h3 className="bg-primary title">Recipe Box</h3>
        <button 
          className={"btn btn-primary " + (this.state.activeButton === "add" ? "": "hidden")}
          onClick={this.addRecipe}
        >
          Add Recipe
        </button>
        <button 
          className={"btn btn-danger " + (this.state.activeButton === "cancel" ? "": "hidden")}
          onClick={this.cancelRecipe}
        >
          Cancel
        </button>
        {
          this.state.new_recipe
          ? (
            <RecipeForm 
              formSubmit={this.formSubmit}
              data={this.state.editedData}/>
          )
          : (
            <RecipesList 
              data={this.state.data}
              recipeStatus={this.recipeStatus}
              activeElementId={this.state.activeElementId}
              editRecipe={this.editRecipe}
              deleteRecipe={this.deleteRecipe} />
          )
        }
      </div>
    );
  }
}

export default App;