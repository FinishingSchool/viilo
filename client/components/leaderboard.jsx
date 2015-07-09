var React = require('react');

var Leaderboard = React.createClass({
  propTypes: {
    // TODO more specific re: array contents
    players: React.PropTypes.array.isRequired
  },
  render: function() {
    var rows = this.createRows(this.props.players);

    return (
      <div data-leaderboard>
        <h2>Rankings - <strong>Season 2</strong></h2>
        <table>
          <thead>
            <tr>
              <th className="rank-heading"><i className="fa fa-certificate"></i></th>
              <th className="name-heading">Name </th>

              <th className="elo-heading">Elo <i className="fa fa-line-chart"></i></th>

              <th>
                <div className="winlose">
                  <span className="win-heading"><i className="fa fa-trophy"></i></span>
                  <span className="muted">-</span>
                  <span className="lose-heading"><i className="fa fa-frown-o"></i></span>
                </div>
              </th>

              <th className="percent-heading">%</th>
              <th className="streak-heading"><i className="fa fa-fire"></i></th>
              <th className="lastten-heading"><i className="fa fa-history"></i> 10</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  },
  createRows: function(players) {
    return players.map(function(player) {
      return this.playerRow(player);
    }, this);
  },
  playerRow: function(player) {
    if (player.provisional) {
      return this.provisionalRow(player);
    } else {
      return this.rankedRow(player);
    }
  },
  rankedRow: function(player) {
    return (
      <tr key={player.id}>
        <td className="rank">{player.rank}</td>
        <td className="name">{player.name} {this.playerEloDelta(player)}</td>
        <td width="15%" className="elo">{player.elo}</td>
        <td width="8%">
          <div className="winlose">
            <span className="win">{player.wins}</span>
            <span className="muted">-</span>
            <span className="lose">{player.losses}</span>
          </div>
        </td>
        <td width="10%" className="percent">{this.winningPercentage(player)}</td>
        <td width="10%" className="streak">{this.streak(player.streak)}</td>
        <td width="10%" className="lastten">{this.lastTen(player.lastTen)}</td>
      </tr>
    );
  },
  provisionalRow: function(player) {
    return (
      <tr key={player.id} className="provisional">
      <td className="rank">{player.rank}</td>
      <td className="name">{player.name} {this.playerEloDelta(player)}</td>
      <td width="15%" className="elo">{player.elo}</td>
      <td width="8%">
        <div className="winlose">
          <span className="win">{player.wins}</span>
          <span className="muted">-</span>
          <span className="lose">{player.losses}</span>
        </div>
      </td>
      <td width="10%" className="percent">{this.winningPercentage(player)}</td>
      <td width="10%" className="streak">{this.streak(player.streak)}</td>
      <td width="10%" className="lastten">{this.lastTen(player.lastTen)}</td>
      </tr>
    );
  },
  //because cameron likes PERCENT, PAUL!
  winningPercentage: function(player) {
    var totalGames = player.wins + player.losses;

    if (totalGames > 0) {
      if (player.wins == totalGames) {
        return '100%';
      } else if (player.wins == 0) {
        return '0%';
      } else {
        var percent = player.wins / totalGames;
        var fixed = percent.toFixed(2);
        // remove leading zero
        return fixed.slice(2) + '%';
      }
    } else {
      return '-';
    }
  },
  playerEloDelta: function(player) {
    if ('eloDelta' in player) {
      if (player.eloDelta >= 0) { // gained elo
        return (<span>({player.eloDelta})</span>);
      } else { // lost elo
        return (<span>({player.eloDelta})</span>);
      }
    }
  },
  /**
  * @param {object} rawStreak - Streak object from player json
  */
  streak: function(rawStreak) {
    if (rawStreak.count == 0) {
      return '-';
    } else {
      return rawStreak.outcome + rawStreak.count;
    }
  },
  /**
  * @param {string[]} rawLastTen - Last ten object from player json
  */
  lastTen: function(rawLastTen) {
    var counts = rawLastTen.reduce(function(prev, curr) {
      prev[curr] += 1;
      return prev;
    }, {W: 0, L: 0});

    return counts.W + ' - ' + counts.L;
  }
})

module.exports = Leaderboard;
