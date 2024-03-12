const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct =asyncHandler( async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const newProduct= await Product.create(req.body);
        res.json(newProduct);
    }
    catch(err){
        throw new Error(err);
    }


});

const updateProduct=asyncHandler(async(req,res)=>{
    id=req.params.id;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
          //  res.json(req.body.slug);
        }
        const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
        res.json(updateProduct);
    }
    catch(err){
        throw new Error(err);
    }

});


const deleteProduct=asyncHandler(async(req,res)=>{
    id=req.params.id;
    try{
        
        const deleteProduct = await Product.findOneAndDelete({ _id: id });
        res.json(deleteProduct);
    }
    catch(err){
        throw new Error(err);
    }

});
const getaProduct= asyncHandler(async(req,res)=>{
    const{id}=req.params;
    try{
        const findproduct=await Product.findById(id);
        res.json(findproduct);
    }
    catch(err){
        throw new Error(err);
    }

  
}
);



const getAllProduct= asyncHandler(async(req,res)=>{
    try{
        const queryObj={...req.query};
        const excludeFields=['page','sort','limit','fields'];
        excludeFields.forEach(el=>delete queryObj[el]);
        console.log(queryObj);
        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);

        let query=Product.find(JSON.parse(queryStr));
        
        
        // Sorting
        
        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
        }
        else{
            query=query.sort('-createdAt');
          //  query.sort('-createdAt');
        }
        // limiting fields
        if(req.query.fields){
            const fields=req.query.fields.split(',').join(' ');
            query=query.select(fields);
        }
        else{
            query=query.select('-__v');
        }
        // pagination
        const page=req.query.page*1 || 1;
        const limit=req.query.limit*1 || 100;
        const skip=(page-1)*limit;
        query=query.skip(skip).limit(limit);
        if(req.query.page){
            const numProducts=await Product.countDocuments();
            if(skip>=numProducts){
                throw new Error('This page does not exist');
            }
        }
        
        const product=await query;
        res.json(product);

    }
    catch(err){
        throw new Error(err);
    }

  
}
);
module.exports = {createProduct ,getaProduct,getAllProduct,updateProduct,deleteProduct};