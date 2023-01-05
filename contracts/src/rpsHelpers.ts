import { Circuit, Field, Struct } from 'snarkyjs';

export class rpsState extends Struct({
  player1Choice: Field, // secret fields
  player2Choice: Field, // field
  result: Field,
}) {}

export class moveSet extends Struct({
  Rock: Field,
  Paper: Field,
  Scissors: Field,
}) {}

export function compareMoves(p1: Field, p2: Field) {
  const winner = Circuit.switch(
    [
      // (moves:) 1: Rock, 2: Paper, 3: Scissors
      p1.equals(p2),
      p1.equals(Field(1)).and(p2.equals(Field(2))),
      p1.equals(Field(1)).and(p2.equals(Field(3))),
      p1.equals(Field(2)).and(p2.equals(Field(1))),
      p1.equals(Field(2)).and(p2.equals(Field(3))),
      p1.equals(Field(3)).and(p2.equals(Field(1))),
      p1.equals(Field(3)).and(p2.equals(Field(2))),
    ],
    Field,
    [
      // (result:) 0: tie, 1: P1 wins, 2: P2 wins
      Field(0),
      Field(2),
      Field(1),
      Field(1),
      Field(2),
      Field(2),
      Field(1),
    ]
  );
  return winner;
}
