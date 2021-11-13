const { db, syncAndSeed, models: { Member, Facility, Booking } } = require('./db')
const express = require('express');
const app = express();


app.get('/api/facilities', async (req, res, next) => {
    try {
        const facilities = await Facility.findAll({
            include: [Booking]
        })
        res.send(facilities)
    } catch (e) {
        next(e)
    }
})


app.get('/api/members', async (req, res, next) => {
    try {
        const members = await Member.findAll({
          include: [
            {
              model: Member,
              as: "sponsor",
            },
            {
              model: Member,
              as: "sponsee",
            },
          ],
        });
        res.send(members)
    } catch (e) {
        next(e)
    }
})


app.get('/api/bookings', async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            include: [Member, Facility]
        })
        res.send(bookings)
    } catch (e) {
        next(e)
    }
})

const init = async () => {
    try {
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => { console.log(`listening to port ${port}`) });
    } catch (e) {
        console.log(e)
    }
}

init();