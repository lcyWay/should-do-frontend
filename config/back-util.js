import dayjs from 'dayjs'

function protectUser(user, full) {
  delete user.password;
  full && delete user.email;
  full && delete user._id;
  return user
}

function makeActivity(title, user) {
  const newActiv = {
    createdAt: new Date(),
    title
  }
  if (user.activity.length > 24) {
    user.activity.pop();
    user.activity.unshift(newActiv);
  } else {
    user.activity.unshift(newActiv);
  }
}

function checkGraphData(user) {
  const date = dayjs(new Date()).format('DD.MM');
  if (user.graphData[date]) {
    user.graphData[date]
  } else {
    const days = getDays();
    const newGraphData = {};
    days.forEach(d => {
      newGraphData[d] = user.graphData[d] || 0;
    })
    user.graphData = newGraphData;
  }
}

function getDays() {
  const dateMas = [];
  for (let i = 0; i < 7; i++) {
    dateMas.unshift(dayjs.unix(dayjs(new Date()).unix() - 86400 * i).format('DD.MM'))
  }
  return dateMas
}

export { getDays, protectUser, makeActivity, checkGraphData }
