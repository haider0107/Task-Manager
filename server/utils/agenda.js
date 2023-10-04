import Agenda from "agenda";
import config from "config";

const agenda = new Agenda({
  db: { address: config.get("DB_STRING"), collection: "agenda" },
});

const startAgenda = async () => {
  await agenda.start();
  console.log("Agenda scheduler started!");
};

export {agenda,startAgenda}