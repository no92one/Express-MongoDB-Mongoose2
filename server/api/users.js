export default function (server, mongoose) {

  // Skapar ett schema för "users", vilket definierar strukturen för varje "user"-dokument i databasen.
  const usersSchema = new mongoose.Schema({
    username: String  // Varje "user" kommer att ha ett "username".
  });

  /* 
    Skapar en Mongoose-modell baserat på usersSchema.
    Detta möjliggör för oss att skapa, läsa, uppdatera och radera (CRUD) dokument i vår "users"-samling (collection).
  */
  const User = mongoose.model("users", usersSchema);

  /*
  Skapar en GET-route på '/api/users'. 
  När denna route anropas, hämtar den alla dokument från vår "users"-samling och skickar tillbaka dem som ett JSON-svar.
  */
  server.get('/api/users', async (req, res) => {
    try {
      res.json(await User.find());  // Använder Mongoose's "find"-metod för att hämta alla "users".
    } catch (error) {
      res.status(500).json({ message: "Ett fel uppstod på servern vid hämtning av användare." });
    }
  });

  // Skapar en GET-route för att hämta en specifik användare med ett specifikt ID.
  server.get('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id); // Hämtar användaren med ID från databasen.
      if (!user) {
        return res.status(404).json({ message: "Användare hittades inte" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Ett fel uppstod på servern vid hämtning av en användare." });
    }
  });

  // Skapar en POST-route för att lägga till en ny användare.
  server.post('/api/users', async (req, res) => {
    try {
      const newUser = new User({ username: req.body.username }) // Skapar en ny användare med "username" från request body.
      const savedUser = await newUser.save() // Sparar den nya användaren i databasen.
      res.status(201).json(savedUser); // Skickar tillbaka den sparade användaren som JSON.
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ett fel uppstod på servern vid skapande av ny användare." });
    }
  });

  // Skapar en PUT-route för att uppdatera en användare med ett specifikt ID.
  server.put('/api/users/:id', async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body); // Returnerar den uppdaterade användaren.
      if (!updatedUser) {
        return res.status(404).json({ message: "Användare hittades inte" });
      }
      res.json(updatedUser); // Skickar tillbaka den uppdaterade användaren som JSON.
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ett fel uppstod på servern vid uppdatering av användare." });
    }
  });

  // Skapar en DELETE-route för att radera en användare med ett specifikt ID.
  server.delete('/api/users/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Användaren hittades inte" });
      }
      res.json({ message: "Användaren har raderats!" }); // Bekräftelse på att användaren har raderats.
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ett fel uppstod på servern vid radering av användare." });
    }
  });

}
