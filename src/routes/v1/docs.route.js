const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
});

router.use('/', swaggerUi.serve);
router.get('/',(req,res)=>{
 res.status(404).send('this is docs route');
});
// router.get(
//   '/',
//   swaggerUi.setup(specs, {
//     explorer: true,
//   })
// );

module.exports = router;
