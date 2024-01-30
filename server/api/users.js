export default function (server, mongoose) {

  // Skapar ett schema för "users", vilket definierar strukturen för varje "user"-dokument i databasen.
  const usersSchema = new mongoose.Schema({
    username: String  // Varje "user" kommer att ha ett "username".
  });

  /* 
    Skapar en Mongoose-modell baserat på usersSchema.
    Detta tillåter oss att skapa, läsa, uppdatera, och ta bort (CRUD) dokument i vår "users"-collection.
  */
  const User = mongoose.model("users", usersSchema);

  /*
  Skapar en GET - route på '/api/users'. 
  När denna route anropas, hämtar den alla dokument från vår "users"-collection och skickar tillbaka dem som en JSON-response.
*/
  server.get('/api/users', async (req, res) => {
    try {
      res.json(await User.find());  // Använder Mongoose's "find"-metod för att hämta alla "users".
    } catch (error) {
      res.status(500).json({ message: "Ett fel uppstod på servern vid hämtning av användare." });
    }
  });


  server.get('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id); // Hämta användare med ID från databasen
      if (!user) {
        return res.status(404).json({ message: "Användare hittades inte" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Ett fel uppstod på servern vid hämtning av en användare." });
    }
  });

  server.post('/api/users', async (req, res) => {
    try {
      const newUser = new User({ username: req.body.username })
      const savedUser = await newUser.save()
      res.status(201).json(savedUser); // Skicka tillbaka den sparade användaren som JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ett fel uppstod på servern vid skapande av ny användare." });
    }
  });

  // PUT (Uppdatera) användare med specifikt ID
  server.put('/api/users/:id', async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Returnera den uppdaterade användaren
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "Användare hittades inte" });
      }
      res.json(updatedUser); // Skicka tillbaka den uppdaterade användaren som JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ett fel uppstod på servern vid uppdatering." });
    }
  });

  // DELETE användare med specifikt ID
  server.delete('/api/users/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "Användaren hittades inte" });
      }
      res.json({ message: "Användaren har raderats!" }); // Skicka bekräftelse på att användaren har raderats
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ett fel uppstod på servern vid radering." });
    }
  });

}