const {ProductModel} = require('../models/product')

const getAllProductsStatic = async (req, res) => { 
    // const search = 'a'
    const products = await ProductModel.find({
        price: { $gte: 30, $lte: 100}
        // name: { $regex: search, $options: 'i' }
    })
    .sort('name')
    .select('name price company')
    .limit(10)
    .skip(10);

    console.log(products)

    return res.status(200).json({products, nbHits: products.length})

}

const getAllProducts = async(req, res) => {
    //using query parameters ?name=john 
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {} 

    if (featured) {
        queryObject.featured = featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = {$regex: name, $options: 'i'}
    }

    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }

        const regEx = /\b(<|>|>=|<=|=)\b/g
        let filters = numericFilters.replace(
            regEx, 
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }
    console.log(queryObject)
    let result = ProductModel.find(queryObject)
    // sort
     if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)
     }
     if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList)        
     }

    const pageNumber = Number(req.query.pageNumber) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (pageNumber - 1) * limit 

    result = result.skip(skip).limit(limit)

      result = result.sort('createdAt')

      const products = await result;
    return res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}
