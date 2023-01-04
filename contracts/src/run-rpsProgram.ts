/* eslint-disable */
import { Field, Poseidon, UInt32, isReady, shutdown } from 'snarkyjs';
import { tic, toc } from './tictoc.js';
import { rpsProgram, rpsState } from './rpsProgram.js';

async function main() {
  tic('SnarkyJs Loading');
  await isReady;
  toc();

  tic('Compiling');
  await rpsProgram.compile();
  toc();

  let initState = new rpsState({
    player1Choice: Field(0), // secret fields
    player2Choice: Field(0), // secret fields

    result: UInt32.from(10),
    player1Score: UInt32.from(0),
    player2Score: UInt32.from(0),
    bestOf: UInt32.from(3),
  });

  // Initialize Game State PROOF
  tic('proof0');
  const proof0 = await rpsProgram.initGame(initState);
  toc();

  let p1MovedState = new rpsState({
    player1Choice: Poseidon.hash([Field(1), Field(24)]),
    player2Choice: Field(0), // secret fields

    result: UInt32.from(10),
    player1Score: UInt32.from(0),
    player2Score: UInt32.from(0),
    bestOf: UInt32.from(3),
  });

  tic('proof P1 made a move');
  const proofP1 = await rpsProgram.p1Move(
    p1MovedState,
    Field(1),
    Field(24),
    proof0
  );
  toc();

  let p2MovedState = new rpsState({
    player1Choice: Poseidon.hash([Field(1), Field(24)]),
    player2Choice: Poseidon.hash([Field(2), Field(12)]),

    result: UInt32.from(10),
    player1Score: UInt32.from(0),
    player2Score: UInt32.from(0),
    bestOf: UInt32.from(3),
  });

  tic('proof P2 made a move');
  const proofP2 = await rpsProgram.p2Move(
    p2MovedState,
    Field(2),
    Field(12),
    proofP1
  );
  toc();

  // tic('proof P1 made a move');
  // const proofP2 = await rpsProgram.p2Move(p1MovedState, Field(1), Field(24), proof0)
  // toc();

  // let validGameState = new rpsState({
  //   player1Choice: Field(-1),
  //   player2Choice: Field(-1),
  //   result: Field(-1),
  //   player1Score: UInt32.from(0),
  //   player2Score: UInt32.from(0),
  //   bestOf: UInt32.from(3),
  // });
  // let hashInitGameState = hashRpsState(validGameState);

  // let myGameState = new rpsState({
  //   player1Choice: Field(-1),
  //   player2Choice: Field(-1),
  //   result: Field(-1),
  //   player1Score: UInt32.from(0),
  //   player2Score: UInt32.from(0),
  //   bestOf: UInt32.from(3),
  // });
  // let hashMyGameState = hashRpsState(myGameState);

  // Initialize Game State PROOF
  // tic('proof with Hash');
  // const proof1 = await rpsProgram.checkWithHash(
  //   hashInitGameState,
  //   hashMyGameState
  // );
  // toc();

  // tic('proof with State');
  // const proof2 = await rpsProgram.checkWithState(
  //   hashInitGameState,
  //   myGameState
  // );
  // toc();

  await shutdown();
}

main();
