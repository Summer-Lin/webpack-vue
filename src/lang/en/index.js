import merchantDetail from "./merchant/detail.js"
import merchantAdd from "./merchant/add.js"
import home from "./home/index.js"
import product from "./product/index.js" 
import layout from "./component/layout.js"

export default {
    common: {
        search: "search",
        reset: "reset"
    },
    home,
    product,
    merchantAdd,
    merchantDetail,
    layout
}