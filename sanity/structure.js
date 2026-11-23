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
      S.documentTypeListItem('newsletterSubscriber').title('Newsletter Subscribers'),
      S.divider(),
      S.documentTypeListItem('contactMessage').title('Contact Messages'),
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
                .title('First Order Discount')
                .child(
                  S.document()
                    .schemaType('firstOrderPromo')
                    .documentId('firstOrderPromo')
                ),
              S.listItem()
                .title('Home Page')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
              S.listItem()
                .title('About Page')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                ),
              S.listItem()
                .title('Contact Page')
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                ),
              S.listItem()
                .title('Privacy Policy')
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('privacyPage')
                ),
              S.listItem()
                .title('Terms of Use')
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('termsPage')
                ),
              S.listItem()
                .title('Cookies Policy')
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('cookiesPage')
                ),
              S.listItem()
                .title('Shipping & Payments')
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('shippingPage')
                ),
              S.listItem()
                .title('Returns Policy')
                .child(
                  S.document()
                    .schemaType('legalPage')
                    .documentId('returnsPage')
                ),
              S.divider(),
              S.documentTypeListItem('categoryGroup').title('Category Groups'),
              S.divider(),
              S.documentTypeListItem('shipping').title('Shipping Methods'),
              S.documentTypeListItem('sale').title('Sales & Coupons'),
            ])
        ),
    ])
