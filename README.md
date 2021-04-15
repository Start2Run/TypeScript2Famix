<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Typescript-to-FAMIX</h3>

  <p align="center">
   This is a parser that harvest a typescript project and generates a FAMIX mse file
    <br />
    <a href="https://github.com/Start2Run/TypeScript2Famix/tree/main"><strong>View Code »</strong></a>
  </p>
</p>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## About The Project
 This is a parser that harvest a typescript project and generates a FAMIX mse file
 
## Getting Started

### Prerequisites

npm install --save-dev ts-morph

### Installation

Install as usual via npm:

*npm install --save-dev typescript2famix*

## Usage

If you clone the code then you can build it using the command

*npm run build*

To create the the .mse file run the following command where the argument is the path of the typescript project for wich we want to create the FAMIX model.

*node ./out/sample.js "D:\Repos\TypeScript2Famix\resources"*

A file sample.mse will be created as result of the command execution.

## Roadmap

See the [open issues](https://github.com/Start2Run/TypeScript2Famix/issues) for a list of proposed features (and known issues).


## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Start2Run - [@Start2Run](https://twitter.com/start2run)

Project Link: [https://github.com/Start2Run/TypeScript2Famix](https://github.com/Start2Run/TypeScript2Famix/)

## Acknowledgements
* [Ts-Morph](https://ts-morph.com/)
* [FAMIX model in typescript](https://github.com/pascalerni/famix)
* [ts-complex](https://github.com/anandundavia/ts-complex)
* [mse-tools](https://github.com/profcfuhrmanets/mse-tools)