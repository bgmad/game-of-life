class Cell {
    constructor(state, pos, scale, neighbors) {
      this.state = state;
      this.pos = pos;
      this.scale = scale;
      this.neighbors = neighbors;
    }
    
    checkPulse() {
      if (this.state) {
        if(this.neighbors < 2) {
          return false;
        } else if (this.neighbors === 2 || this.neighbors === 3) {
          return true;
        }
        else if (this.neighbors > 3) { 
          return false;
        } else {
          return false;
        }
      } else {
        if(this.neighbors === 3) {
          return true;
        } else {
          return false;
        }
      }
    }
    
    render() {
      fill(this.state ? 0 : 255);
      stroke(0);
      strokeWeight(1);
      rect(this.pos.x * this.scale.x, this.pos.y * this.scale.y, this.scale.x, this.scale.y);
    }
  }
  