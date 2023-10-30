const express=require('express');
const router=express.Router();

const {getBlogs,getBlogAnalytics,blogSearch} = require('../controller/blogController');

router.get('/get',getBlogs);
router.get('/blog-stats',getBlogAnalytics);
router.get('/blog-search',blogSearch);


module.exports = router;