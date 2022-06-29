function upOneDirectory(dir_in){
    last_slash_pos = dir_in.lastIndexOf('/')
    dir_out = dir_in.slice(0,last_slash_pos)
    return dir_out
}

function getSubdirectory(dir_in,filename){
    dir_out = dir_in.concat("/",filename)
    return dir_out
}