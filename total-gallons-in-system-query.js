[
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: "amountInGallons",
          test: {
            $sum: "$amountInGallons"
          }
        }
    }
  ]