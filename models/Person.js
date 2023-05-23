const personSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const person = await Person.findById(req.params.id);

  router.get("/", async (req, res, next) => {
    try {
      const people = await Person.find().populate('owner', 'firstname lastname -_id');
      res.status(200).json(people);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

module.exports = mongoose.model("Person", personSchema)
