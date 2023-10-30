const axios = require('axios');
const _ = require('lodash');

const blogResults=async()=>
{
    const response=await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
        headers:{
            'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'   
        }
    } );
    const blogs=response.data.blogs;
    return blogs;
}

const memoizedBlogs=_.memoize(blogResults);

const getBlogs=async(req,res)=>
{   
    const blogs=await memoizedBlogs();
    res.status(200).json(blogs);
}

const blogAnalytics=async()=>
{
    try {
        
    const blogs=await blogResults();

    const totalBlogs=_.size(blogs);
    const longestTitle=_.maxBy(blogs,(blog)=>blog.title.length).title;
    const containsPrivacy=_.filter(blogs,(blog)=>blog.title.toLowerCase().includes('privacy'));
    const unique=_.uniqBy(blogs,(blog)=>blog.title);

    // const privacy=containsPrivacy.map((res)=>res.title);
    const uniqueTitles=unique.map((res)=>res.title);
    // console.log(totalBlogs);
    // console.log(longestTitle);
    // console.log(containsPrivacy);
    // console.log(uniqueTitles);

    const analytics={totalBlogs,longestTitle,containsPrivacy,uniqueTitles};
    return analytics;
    } catch (error) {
        throw new Error('An error occurred trying to fetch data');
    }
}

const memoizedAnalytics=_.memoize(blogAnalytics);

const getBlogAnalytics=async(req,res)=>
{
    try {
        const analytics=await memoizedAnalytics();
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({error:'An error occurred while trying to fetch data'});
    }
}

const searchResults=async(query)=>
{
    try {
        const blogs=await blogResults();
        const results=_.filter(blogs,(blog)=>blog.title.toLowerCase().includes(query.toLowerCase()));
        return results;
        
    } catch (error) {
        throw new Error('An error occurred trying to fetch data');
    }
}

const memoizedSearch=_.memoize(searchResults);

const blogSearch=async(req,res)=>
{
    try {
        const query=req.query.query;
        // console.log(query);
        if(!query) return res.status(400).json({error:'Query is not provided'});
        const results=await memoizedSearch(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


module.exports={getBlogs,getBlogAnalytics,blogSearch};