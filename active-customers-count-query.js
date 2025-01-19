[
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer"
      }
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$customer",
        preserveNullAndEmptyArrays: true
      }
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
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
        },
        totalAmountInGallons: {
          $sum: "$amountInGallons"
        }
      }
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        _id: "$_id.customer._id",
        firstName: "$_id.customer.firstName",
        lastName: "$_id.customer.lastName",
        companyName: "$_id.customer.companyName",
        lastTransactionDate: true,
        totalAmountInGallons:
          "$totalAmountInGallons"
      }
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        lastTransactionDate: {
          $gte: new Date(
            ISODate().getTime() -
              1000 * 60 * 60 * 24 * 365
          )
        }
      }
  },
  {
    $group: {
      _id: null,
      numCustomers: {
        $sum: 1
      },
      totalGallons: {
        $sum: "$totalAmountInGallons"
      }
    }
  }
]