


export interface Product {
    stock: number;
    image(image: any): unknown;
    _id : string;
    title: string;
    _type : "product";
    productImage: {
        asset: {
          _ref: string,
          _type: 'image',
        },
    };
    
    price: number;
    description?: string;
    slug: {
      _type : "slug",
      current: string;
    };
     
}