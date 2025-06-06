const mongoose=require('mongoose');

const dishSchema=new mongoose.Schema({
    strMeal:String,
    strMealThumb:String,
    idMeal:String,
    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: String } 
        }
    ],
     steps: [{ type: String, required: true }] ,
     servings:String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
})

const Dish=mongoose.model('Dish',dishSchema);

module.exports=Dish;