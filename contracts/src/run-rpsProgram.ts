/* eslint-disable */
import { Field, UInt32, isReady, shutdown } from 'snarkyjs';
import { tic, toc } from './tictoc.js';
import { rpsProgram, rpsState } from './rpsProgram.js';

async function main() {
  tic('SnarkyJs Loading');
  await isReady;
  toc();

  tic('Compiling');
  await rpsProgram.compile();
  toc();

  let initGameState = new rpsState({
    player1Choice: Field(-1),
    player2Choice: Field(-1),
    result: Field(-1),
    player1Score: UInt32.from(0),
    player2Score: UInt32.from(0),
    bestOf: UInt32.from(3),
  });

  // Initialize Game State PROOF
  tic('proof0');
  const proof0 = await rpsProgram.initState(initGameState);
  toc();

  //send this proof to player to start game:

  //player guess 1
  // let playerState = new gameState({
  //   solutionHash: serverSolutionHash,
  //   lastGuess: Field(-1),
  //   numTurns: UInt32.from(0),
  //   hint: UInt32.from(0)
  // });

  // Turn 1:
  // tic('proof1_0');
  // const proof1_0 = await SimpleProgram.guess(playerState, Field(70), proof0 )
  // toc();

  // tic('proof1_1');
  // const proof1_1 = await SimpleProgram.checkGuess(playerState, UInt32.from(1), proof1_0 )
  // toc();

  await shutdown();
}

main();