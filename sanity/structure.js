export const structure = (S) =>
  S.list()
    .title('Spotteq Store')
    .items([
      S.documentTypeListItem('category').title('Categories'),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.divider(),
      S.documentTypeListItem('bundle').title('Bundles'),
      S.divider(),
      S.documentTypeListItem('order').title('Orders'),
      S.divider(),
      S.documentTypeListItem('userInfo').title('Customers'),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('Announcement Bar')
                .child(
                  S.document()
                    .schemaType('announcement')
                    .documentId('announcement')
                ),
              S.listItem()
                .title('Home Page SEO')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
              S.divider(),
              S.documentTypeListItem('categoryGroup').title('Category Groups'),
              S.divider(),
              S.documentTypeListItem('shipping').title('Shipping Methods'),
              S.documentTypeListItem('sale').title('Sales & Coupons'),
            ])
        ),
    ])
