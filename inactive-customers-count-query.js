[
  {
    $lookup:
      {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer"
      }
  },
  {
    $unwind:
      {
        path: "$customer",
        preserveNullAndEmptyArrays: true
      }
  },
  {
    $group:
      {
        _id: {
          customer: {
            _id: "$customer._id",
            firstName: "$customer.firstName",
            lastName: "$customer.lastName",
            companyName: "$customer.companyName"
          }
        },
        lastTransactionDate: {
          $last: "$date"
        }
      }
  },
  {
    $project:

      {
        _id: "$_id.customer._id",
        firstName: "$_id.customer.firstName",
        lastName: "$_id.customer.lastName",
        companyName: "$_id.customer.companyName",
        lastTransactionDate: true
      }
  },
  {
    $match:

      {
        lastTransactionDate: {
          $lt: new Date(
            ISODate().getTime() -
              1000 * 60 * 60 * 24 * 365
          )
        }
      }
  },
  {
    $count:
      "numInactiveCustomers"
  }
]