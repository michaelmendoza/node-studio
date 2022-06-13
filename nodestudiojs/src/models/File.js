class File{

    constructor(file){
        this.filename = file.filename;
        this.fileext = file.fileext;
        this.filepath = file.filepath;
    }

    get name(){ return file.filename; }

    get extension(){ return file.fileext; }

    get path(){ return file.filepath; }

}

export default File;