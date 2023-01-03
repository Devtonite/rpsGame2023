/* eslint-disable */
import {
  Circuit,
  Experimental,
  Field,
  Poseidon,
  SelfProof,
  Struct,
  UInt32,
} from 'snarkyjs';

export class rpsState extends Struct({
  player1Choice: Field,
  player2Choice: Field,
  result: Field,
  player1Score: UInt32,
  player2Score: UInt32,
  bestOf: UInt32,
}) {}

// export function hashRpsState(stateToBeHashed: rpsState){

//   let p1ScoreField = Poseidon.hash(stateToBeHashed.player1Score.toFields())
//   let p2ScoreField = Poseidon.hash(stateToBeHashed.player2Score.toFields())
//   let bestOfField = Poseidon.hash(stateToBeHashed.bestOf.toFields())

//   return Poseidon.hash([
//     stateToBeHashed.player1Choice,
//     stateToBeHashed.player2Choice,
//     stateToBeHashed.result,
//     p1ScoreField,
//     p2ScoreField,
//     bestOfField])
// }

export const rpsProgram = Experimental.ZkProgram({
  publicInput: rpsState,

  methods: {
    initState: {
      privateInputs: [],
      method(publicInput: rpsState) {
        publicInput.player1Choice.assertEquals(Field(-1));
        publicInput.player2Choice.assertEquals(Field(-1));
        publicInput.result.assertEquals(Field(-1));
        publicInput.player1Score.assertEquals(UInt32.from(0));
        publicInput.player2Score.assertEquals(UInt32.from(0));
        publicInput.bestOf.assertGt(UInt32.from(0));
        publicInput.bestOf.mod(2).assertEquals(UInt32.from(1));
      },
    },
  },
});
