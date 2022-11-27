  <li className="product-con" key={product.id} id={product.id}>
          {/* <li key={product.id} > */}
            <Link to={'/product/'+product.id}>
   <img
              src={product.images[0].src}
              alt={product.name}
            />
           {product.categories.map(pro =>
           <p className="product__category">  {pro.name} </p>)}
            <p className="product__name">{product.name }</p>
            <p className="product__price">৳{product.price}</p>
            <p className="product__rating"><FaStar  className="star"/>0</p></Link>
           

            <button type="button" onClick={() => addToCart(product) } >
              <div>
                <MdAddShoppingCart size={16} color="#FFF" /> 

              </div>

              <span>Add To Cart</span>
            </button>
          </li>