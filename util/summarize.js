// Main function which needs to run at start
async function main() {
    var args = process.argv;

    const fs = require('fs');
    const path = require('path');

    const metadata = require('../metadata.json')

    // This gets the filename from commandline
    let dirname = path.join(__dirname, args[2]);

    let summarized_data = {}

    fs.readdir(dirname, function(err, filenames) {
        if (err) throw err;

        filenames.forEach(function(filename) {
            let in_filepath = path.join(__dirname, args[2], filename);
            filename = filename.slice(0, -4);
            if (in_filepath.substr(-3) == 'txt') {
                let text = fs.readFileSync(in_filepath, "utf8");
                let text_split = text.split('\n\n');
                // Benchmark data is currently the first continuous block of text
                let benchmark_data = text_split.shift();
                // The rest is analysis data
                let analysis_data = text_split;
                // Mean squares analysis is 5, this creates an array of the data
                let msa = analysis_data[5].replace(/\s+/g, ' ').trim().split(' ');

                summarized_data[filename] = {};
                for (let i = 3; i < msa.length; i += 3) {
                    if (i == 3) {
                        summarized_data[filename]["base"] = msa[i];
                    } else {
                        let component_letter = msa[i - 1];
                        // let pallet = filename.split('_')[0];
                        // summarized_data[filename][component_letter] = {}
                        // summarized_data[filename][component_letter]["meta"] = metadata[pallet][component_letter] || "?";
                        // summarized_data[filename][component_letter]["time"] = msa[i];
                        summarized_data[filename][component_letter] = msa[i];
                    }
                }
            }
        });
        console.log(summarized_data)
        fs.writeFileSync("../summary.json", JSON.stringify(summarized_data, null, '\t'));
    });

}

main()
