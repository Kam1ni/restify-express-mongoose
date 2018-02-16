const express = require("express");

function onError(err,req,res,next){
	return module.exports.onError(err,req,res,next);
}

module.exports = function(model){
	let router = express.Router();
	router.get("/", async function(req,res,next){
		try{
			res.json(await model.find());
		}catch(err){
			onError(err,req,res,next);
		}
	});

	router.get("/:id", async function(req,res,next){
		try{
			res.json(await model.findById(req.params.id));
		}catch(err){
			onError(err,req,res,next);
		}
	});

	router.post("/", async function(req,res,next){
		try{
			let item = new model(req.body);
			await item.save();
			res.json(item);
		}catch(err){
			onError(err,req,res,next);
		}
	});

	router.put("/:id", async function(req,res,next){
		try{
			let item = await model.findById(req.params.id);
			if (!item){
				throw new Error("Item does not exist", {status: 401});
			}
			item.set(req.body);
			await item.save();
			res.json(item);
		}catch(err){
			onError(err,req,res,next);
		}
	});

	router.delete("/:id", async function(req,res,next){
		try{
			let item = await model.findById(req.params.id);
			await item.remove();
			res.json(item);
		}catch(err){
			onError(err,req,res,next);
		}
	});

	return router;
}

module.exports.onError = function(err, req, res, next){
	console.error(err.message);
	console.error(err.stack);
	res.status(err.status || 500).json({message:err.message});
}