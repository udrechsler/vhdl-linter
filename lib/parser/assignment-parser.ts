import {ParserBase} from './parser-base';
import {ParserPosition} from './parser-position';
import {OAssignment, ParserError} from './objects';

export class AssignmentParser extends ParserBase {
  constructor(text: string, pos: ParserPosition, file: string, private parent: object) {
    super(text, pos, file);
    this.debug(`start`);
    this.start = pos.i;
  }
  parse(): OAssignment {
    let assignment = new OAssignment(this.parent, this.pos.i);
    assignment.begin = this.pos.i;
    let leftHandSideI = this.pos.i;
    let leftHandSide = '';
    while (this.text.substr(this.pos.i, 2) !== '<=') {
      leftHandSide += this.text[this.pos.i];
      this.pos.i++;
      if (this.pos.i === this.text.length) {
        throw new ParserError(`expecteded <=, reached end of text. Start on line: ${this.getLine(leftHandSideI)}`, leftHandSideI);
      }
    }
    assignment.writes = this.extractReadsOrWrite(assignment, leftHandSide, leftHandSideI);
    this.expect('<=');
    let rightHandSide = '';
    let rightHandSideI = this.pos.i;

    assignment.reads = [];
    while (this.text.substr(this.pos.i, 1) !== ';') {
      rightHandSide += this.text[this.pos.i];
      this.pos.i++;
    }
    assignment.reads = this.extractReadsOrWrite(assignment, rightHandSide, rightHandSideI);
    this.expect(';');
    // console.log(assignment,  assignment.constructor.name, assignment instanceof Assignment);
    assignment.end = this.pos.i;
    return assignment;
  }



}
