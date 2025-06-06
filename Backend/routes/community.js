const router=require('express').Router();
const Community=require('../models/Community');
const cloudinary=require('../cloudinary');
const fileUpload = require('express-fileupload');

router.use(fileUpload({ useTempFiles: true }));

router.post('/addpost/:id',async(req,res)=>{
     const userId=req.params.id;
     const file = req.files.image;

      const result = await cloudinary.uploader.upload(file.tempFilePath, {
           folder: 'community',
         });

        const dishImg = result.secure_url;
        const {title,recipe}=req.body;
        const post=new Community({
            username:userId,
            title,
            recipe,
            photo:dishImg
        })

        await post.save();
        res.status(201).json({message:"successfully posted",data:post});


})

router.get('/getpost', async (req, res) => {
  try {
    const posts = await Community.find() .populate('username', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch posts' });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const post = await DishPost.findById(req.params.id);
    const userId = req.body.userId;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId); 
    } else {
      post.likes.push(userId);  
      
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like/unlike post' });
  }
});



module.exports=router;