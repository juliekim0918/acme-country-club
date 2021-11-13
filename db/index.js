const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_country_club_db');
const { DataTypes: { STRING, UUID, UUIDV4 } } = Sequelize


const members = ["moe", "lucy", "larry", "ethyl"];
const facilities = ["tennis", "ping-pong", "raquet-ball", "bowling"];

const Member = db.define('member', {
    id: {
        type: UUID,
        // automatically makes it false so this is redundant 
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    first_name: {
        type: STRING(20), 
        unique: true,
        allowNull: false
    }
})

const Facility = db.define("facility", {
  id: {
    type: UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  fac_name: {
    type: STRING(100),
    unique: true,
    allowNull: false,
  },
});

const Booking = db.define('booking', {});

// ONE member belongs to a sponsor 
Member.belongsTo(Member, { as: 'sponsor' })
// ONE sponsor can have many sponsees and refers to sponsorId 
Member.hasMany(Member, {as: 'sponsee', foreignKey: 'sponsorId'})

Facility.hasMany(Booking);
Booking.belongsTo(Facility);
Member.hasMany(Booking);
Booking.belongsTo(Member);



const syncAndSeed = async () => {
  await db.sync({ force: true });
  const [moe, lucy, larry, ethyl] = await Promise.all(
    members.map((member) => Member.create({ first_name: member }))
  );

  const [tennis, pingpong, raquetball, bowling] = await Promise.all(
    facilities.map((facility) => {
      return Facility.create({ fac_name: facility });
    }),
  );
    

    await Promise.all([
        moe.update({
            sponsorId: lucy.id
        }),
        ethyl.update({
            sponsorId: moe.id
        }),
        larry.update({
            sponsorId: ethyl.id
        })
    ])
        
    const [booking1, booking2, booking3] = await Promise.all([
        Booking.create({ memberId: moe.id, facilityId: tennis.id }),
        Booking.create({ memberId: lucy.id, facilityId: bowling.id }),
        Booking.create({ memberId: larry.id, facilityId: raquetball.id }),
    ]);

}

module.exports = {
  db,
  syncAndSeed,
  models: { Member, Facility, Booking }
};