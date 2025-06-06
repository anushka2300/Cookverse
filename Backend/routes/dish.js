const router=require('express').Router();
const Dish=require('../models/Dishes')
const fileUpload = require('express-fileupload');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const cloudinary=require('../cloudinary');
const { use } = require('passport');

router.use(fileUpload({ useTempFiles: true }));

router.post('/addDish',async (req,res)=>{
    try{
  
    const {strMeal,strMealThumb,idMeal,servings}=req.body;
    const data=new Dish({
        strMeal,strMealThumb,idMeal,servings
    })
    await data.save();
    res.status(200).json({message:"data saved"});
}
catch(err){
    res.status(500).json({error:err});
}
})

router.get('/getDish',async(req,res)=>{
    try{
        const data=await Dish.find({user:null});
        res.status(200).json({message:"data received",data:data})
    }
    catch(err){
        res.status(500).json({error:err});
    }
})

router.post('/generateRecipe', async (req, res) => {
  try {
    const file = req.files.image;
   
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'dish_images',
    });

    const imageUrl = result.secure_url;
 
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(buffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const content = await model.generateContent([
      {
        inlineData: {
          mimeType: file.mimetype,
          data: imageBase64,
        },
      },
      {
        text:`Give the name of the dish, then give ingredients used in this along with the quantity required, give step by step recipe that is making process of the dish and the number of people can eat with that quantity.

Give output like this: 
{
  "name": "momoz",
  "ingredients": [
    "Soyabeans - 250gm",
    "Onion - 3",
    "Tomato - 3"
  ],
  "steps": [
    "Make a dough of...",
    "Prepare stuffing...",
    ...
  ],
  "servings":"5 people"
}

Return only valid JSON. No extra text, markdown or backticks. Use double quotes for keys and values.`,
      },
    ]);

    let recipeText = content.response.text().trim();
     recipeText = recipeText.replace(/```json|```/g, '').trim();
      let recipeObj;
    try {
      recipeObj = JSON.parse(recipeText);
    } catch (err) {
      console.error('Failed to parse recipe text:', recipeText);
      return res.status(400).json({ error: 'Invalid recipe format returned by model' });
    }

    res.status(200).json({
      imageUrl,
      recipe: recipeObj,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});

function parseIngredients(ingredientList) {
  console.log(ingredientList);
  return ingredientList.map(item => {
    const parts = item.split(' - ');
    return {
      name: parts[0].trim(),
      quantity: parts[1] ? parts[1].trim() : ''
    };
  });
}


router.post('/generateRecipeName', async (req, res) => {
  try {
    const {id} = req.body
    const dish=await Dish.findById(id);
    
      if (!dish) {
       return res.status(404).json({ message: "Dish not found" });
      }

        if (dish.ingredients?.length > 0 && dish.steps?.length > 0) {
      return res.status(200).json({
        message: "Recipe already exists",
        recipe: dish
      });
    }
     const name=dish.strMeal
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const content = await model.generateContent([
       
      {
        text:`The dish name is ${name}, give ingredients used in this along with the quantity required, give step by step recipe that is making process of the dish and the number of people can eat with that quantity.

Give output like this: 
{
  "name": "momoz",
  "ingredients": [
    "Soyabeans - 250gm",
    "Onion - 3",
    "Tomato - 3"
  ],
  "steps": [
    "Make a dough of...",
    "Prepare stuffing...",
    ...
  ],
  "servings":"5 people"
}

Return only valid JSON. No extra text, markdown or backticks. Use double quotes for keys and values.`,
      },
    ]);

    let recipeText = content.response.text().trim();
     recipeText = recipeText.replace(/```json|```/g, '').trim();
      let recipeObj;
    try {
      recipeObj = JSON.parse(recipeText);
    } catch (err) {
      console.error('Failed to parse recipe text:', recipeText);
      return res.status(400).json({ error: 'Invalid recipe format returned by model' });
    }
   
    const ingre=parseIngredients(recipeObj.ingredients);
    
    const updatedDish = await Dish.findByIdAndUpdate(
      id,
        {
    ingredients: ingre,
    steps: recipeObj.steps,
    servings:recipeObj.servings
      },
      
      { new: true }
    );


    res.status(200).json({
      recipe: updatedDish,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
});


router.post('/save/:id',async(req,res)=>{
      try{
         const file = req.files?.image;
         if (!file) return res.status(400).json({ message: 'Image is required' });
 
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'fav_dishes',
    });
 
    const strMealThumb = result.secure_url;
      
         const {strMeal,servings,ingredients,steps}=req.body;
           
        let ingre = [];
        try {
        const parsed = JSON.parse(ingredients);  
        ingre = parseIngredients(parsed);       
            } catch (e) {
              return res.status(400).json({ message: 'Invalid ingredients format' });
            }
            parsedSteps = JSON.parse(steps); 
        
         const id=req.params.id;
        const alreadySaved = await Dish.findOne({ user: id,strMeal: strMeal});
         
        if (alreadySaved) {
            return res.status(409).json({ message: "Dish already saved in favorites" });
         }
         
       
        const data=new Dish({
        strMeal,
        strMealThumb,
        ingredients:ingre,
        steps:parsedSteps,
        user:id,
        servings
    })
    console.log("data input done")
    await data.save();
    res.status(200).json({message:"data saved"});
      }
      catch(err){
        console.log(err);
    res.status(501).json({error:err});
      }
})



router.delete('/remove/:userId/:dishId', async (req, res) => {
  try {
    const { userId, dishId } = req.params;
 
    const deletedDish = await Dish.findOneAndDelete({ _id: dishId, user: userId });

    if (!deletedDish) {
      return res.status(404).json({ message: 'Dish not found or not owned by user' });
    }

    res.status(200).json({ message: 'Dish removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing dish' });
  }
});
 

function parseName(ingredientList) {
  return ingredientList.map(item => ({ name: item }));
}

router.get('/get/:userId/:dishId',async (req,res)=>{
 try{
   const { userId, dishId } = req.params;
    const dish = await Dish.findOne({ _id: dishId, user: userId });
     if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
     res.status(200).json({message:"data retrieved",data:dish});
 }
 catch(err){
   res.status(500).json({ error: 'Server error retrieving dish' });
 }
})

router.get('/save/:id', async (req, res) => {
  try {
    const userId = req.params.id;
   console.log(userId);
    const dishes = await Dish.find({ user: userId });
    res.status(200).json({message:"data retrieved",data:dishes});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports=router;